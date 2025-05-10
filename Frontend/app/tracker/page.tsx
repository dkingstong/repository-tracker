'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { ChevronDown, ChevronUp, Github, Trash, RefreshCw, ExternalLink, User } from 'lucide-react'
import { ApolloProvider, useMutation, useQuery } from '@apollo/client'
import { CREATE_USER_REPOSITORY, DELETE_USER_REPOSITORY, GET_USER_REPOSITORIES, SYNC_USER_REPOSITORIES, UPDATE_USER_REPOSITORY_SEEN } from '../../lib/graphql/userRepository/queries'
import client from '@/lib/graphql/apolloClient'
import ReactMarkdown from 'react-markdown'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EntityFilters, { FilterOption, SortOption, FilterState, SortState } from '../../components/EntityFilters'

interface UserRepository {
  id: string
  seen: boolean
  user: User
  repository: {
    name: string
    latestRelease: {
      version: string
      releaseDate: string
      description: string
    }
  }
}

interface User {
  id: string
  githubId: string
  firstName?: string
  lastName?: string
  email?: string
}

// Define filter types for type safety
type RepositoryFilterFields = 'search' | 'onlyUnseen';
type RepositorySortFields = 'NAME' | 'RELEASE_DATE';

export default function Tracker() {
  const { toast } = useToast();
  
  // Define available filter options
  const filterOptions: FilterOption<RepositoryFilterFields>[] = [
    {
      id: 'search',
      label: 'Repository Name',
      type: 'search',
      placeholder: 'Search by name or owner...'
    },
    {
      id: 'onlyUnseen',
      label: 'Unread only',
      type: 'boolean'
    },
  ];
  
  // Define available sort options
  const sortOptions: SortOption<RepositorySortFields>[] = [
    { id: 'NAME', label: 'Repository Name' },
    { id: 'RELEASE_DATE', label: 'Release Date' }
  ];
  
  // Filter and order state
  const [filter, setFilter] = useState<FilterState>({});
  const [sort, setSort] = useState<SortState<RepositorySortFields>>({ 
    field: 'NAME', 
    direction: 'ASC' 
  });
  
  // Convert generic filter state to specific GraphQL filter format
  const getGraphQLFilter = () => {
    return {
      search: filter.search as string | undefined,
      onlyUnseen: filter.onlyUnseen as boolean | undefined
    };
  };
  
  // Convert generic sort state to specific GraphQL order format
  const getGraphQLOrder = () => {
    return {
      field: sort.field,
      direction: sort.direction
    };
  };
  
  const { data, loading, error } = useQuery(GET_USER_REPOSITORIES, {
    variables: {
      filter: getGraphQLFilter(),
      order: getGraphQLOrder()
    },
    fetchPolicy: 'cache-first',
    onError: (error) => {
      toast({
        title: 'Error fetching repositories',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  const [createUserRepository, {loading: createUserRepositoryLoading}] = useMutation(CREATE_USER_REPOSITORY, {
    refetchQueries: [GET_USER_REPOSITORIES],
    onError: (error) => {
      toast({
        title: 'Error adding repository',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  const [deleteUserRepository] = useMutation(DELETE_USER_REPOSITORY, {
    refetchQueries: [GET_USER_REPOSITORIES],
    onError: (error) => {
      toast({
        title: 'Error deleting repository',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  const [updateUserRepositorySeen] = useMutation(UPDATE_USER_REPOSITORY_SEEN, {
    refetchQueries: [GET_USER_REPOSITORIES],
    onError: (error) => {
      toast({
        title: 'Error updating repository',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  const [syncUserRepositories] = useMutation(SYNC_USER_REPOSITORIES, {
    refetchQueries: [GET_USER_REPOSITORIES],
    onError: (error) => {
      toast({
        title: 'Error syncing repository',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  if (error) return `Error! ${error.message}`;

  const [repositories, setRepositories] = useState<UserRepository[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [newRepoUrl, setNewRepoUrl] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    if(data && !createUserRepositoryLoading) {
      setUser(data?.getUserRepositories.user)
      setRepositories(data?.getUserRepositories.userRepositories)
    }
  }, [data, filter, sort])

  const addRepository = async () => {
    if (!newRepoUrl) return

    const match = newRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return

    const [, owner, name] = match
    try {
      const result = await createUserRepository({ variables: { owner, name } })
      if (result?.data?.createUserRepository) {
        // Get the returned repository data and properly format it to match your UserRepository type
        const newRepo = result.data.createUserRepository
        setRepositories(prev => [...prev, newRepo])
      }
      
      setNewRepoUrl('')
    } catch (error) {
      console.error('Error adding repository:', error)
    }
  }

  const toggleSeen = (repoId: string) => {
    setRepositories(repositories.map(repo => 
      repo.id === repoId 
        ? { ...repo, seen: !repo.seen }
        : repo
    ))
  }

  const toggleExpand = (repoId: string) => {
    setExpandedItems(prevExpanded => 
      prevExpanded.includes(repoId)
        ? prevExpanded.filter(id => id !== repoId)
        : [...prevExpanded, repoId]
    )
  }

  const formatDate = (date: string) => {
    const numberDate = Number(date)
    if (isNaN(numberDate)) return new Date(date).toLocaleDateString()
    return new Date(numberDate).toLocaleDateString()
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    return 'there';
  }

  return (
    <ApolloProvider client={client}> 
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin">
              <RefreshCw className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center">Loading repositories...</h2>
          </div>
        </div>
      )}
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex items-center gap-2 mr-4">
              <Github className="h-5 w-5 text-primary" />
              <span className="font-semibold">Release Tracker</span>
            </div>
            <div className="flex-1"></div>
            {user && (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 hover:bg-primary/10"
                  onClick={() => syncUserRepositories()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.githubId}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://github.com/${user.githubId}.png`} alt={user.githubId} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 sm:py-12 flex flex-col gap-8 sm:gap-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="max-w-4xl mx-auto w-full"
          >
            <h2 className="text-2xl font-bold mb-3">
              {getGreeting()}, <span className="text-primary">{getUserName()}</span>!
            </h2>
            <p className="text-muted-foreground mb-6">
              Track your favorite GitHub repositories and never miss an update.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-card/50 p-4 rounded-xl border shadow-sm">
              <div className="flex-1 relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Enter a GitHub repository URL"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="pl-10 transition-all focus-visible:ring-primary/70"
                />
              </div>
              <Button 
                onClick={addRepository}
                className="w-full sm:w-auto bg-primary/90 hover:bg-primary transition-all"
              >
                Add Repository
              </Button>
            </div>
          </motion.div>

          {/* Repository Filters Component */}
          <div className="max-w-4xl mx-auto w-full">
            <EntityFilters
              title="Filter & Sort Repositories"
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border bg-card/30 shadow-md"
          >
            {repositories.length === 0 ? (
              <div className="py-16 text-center">
                <Github className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No repositories added yet</p>
                <p className="text-sm text-muted-foreground/70 mt-2">Add your first repository above</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                <AnimatePresence>
                  {repositories.map((repo, index) => {
                    const isExpanded = expandedItems.includes(repo.id);
                    return (
                      <motion.li 
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group bg-card/50 hover:bg-card/90 transition-colors"
                      >
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => {
                            if (!repo.seen) {
                              updateUserRepositorySeen({ variables: { id: repo.id, seen: true } })
                              toggleSeen(repo.id)
                            }
                            toggleExpand(repo.id)
                          }}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded-lg bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
                              <Github className="h-5 w-5 text-primary" />
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="font-medium truncate group-hover:text-primary transition-colors">{repo.repository.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{repo.repository.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!repo.seen && (
                              <Badge 
                                variant={'default'}
                                className="text-xs whitespace-nowrap animate-pulse"
                              >
                                {'New Update'}
                              </Badge>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUserRepository({ variables: { id: repo.id } })
                                setRepositories(prev => prev.filter(r => r.id !== repo.id))
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            
                            <div className="h-8 w-8 flex items-center justify-center shrink-0 text-primary/80">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 transition-transform" />
                              ) : (
                                <ChevronDown className="h-4 w-4 transition-transform" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 bg-muted/30">
                                <div className="flex items-center justify-between mb-4 border-t pt-4 border-border/30">
                                  <span className="text-sm font-medium">Latest Release</span>
                                  <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                    {repo.repository.latestRelease?.version || 'No version'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm font-medium">Release Date</span>
                                  <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                    {repo.repository.latestRelease?.releaseDate ? 
                                      formatDate(repo.repository.latestRelease?.releaseDate) : 
                                      'No date'}
                                  </span>
                                </div>
                                
                                {repo.repository.latestRelease?.description && (
                                  <div className="mt-4 border-t pt-4 border-border/30">
                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                      <span>Release Notes</span>
                                      <div className="ml-2 h-px flex-1 bg-border/30"></div>
                                    </h4>
                                    <div className="prose prose-sm max-w-none bg-card/50 rounded-md p-4 overflow-y-auto max-h-64 border border-border/30 shadow-inner">
                                      <ReactMarkdown>
                                        {repo.repository.latestRelease.description}
                                      </ReactMarkdown>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                      <a 
                                        href={`https://github.com/${repo.repository.name}/releases`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                                      >
                                        View on GitHub <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>
        </motion.div>
      </div>
    </ApolloProvider>
  )
} 