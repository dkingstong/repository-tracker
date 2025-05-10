'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Github, Trash, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { UserRepository } from '@/app/tracker/page'

interface RepositoryListItemProps {
  repo: UserRepository;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSeen: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const formatDate = (date: string) => {
  const numberDate = Number(date)
  if (isNaN(numberDate)) return new Date(date).toLocaleDateString()
  return new Date(numberDate).toLocaleDateString()
}

const RepositoryListItem = ({ 
  repo, 
  isExpanded, 
  onToggleExpand, 
  onToggleSeen, 
  onDelete,
  index 
}: RepositoryListItemProps) => {

  return (
    <motion.li 
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
            onToggleSeen(repo.id)
          }
          onToggleExpand(repo.id)
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
              onDelete(repo.id)
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
  )
} 

export default RepositoryListItem;