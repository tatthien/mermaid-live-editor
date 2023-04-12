interface ISidebarProps {
  children: JSX.Element
}

export default function Sidebar({ children }: ISidebarProps) {
  return (
    <div className='border-r'>
      <div>{children}</div>
    </div>
  )
}
