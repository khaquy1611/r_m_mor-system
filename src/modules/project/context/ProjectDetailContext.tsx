import { createContext, useContext } from 'react'

const ProjectDetailContext = createContext<any>(null)

export function useProjectDetailContext() {
  const contextValue = useContext(ProjectDetailContext)
  if (contextValue === null) throw Error('context has not been Provider')
  return contextValue
}

export default function ProjectDetailProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProjectDetailContext.Provider value={{}}>
      {children}
    </ProjectDetailContext.Provider>
  )
}
