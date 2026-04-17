import Sidebar from './Sidebar'
import TopBar  from './TopBar'

/**
 * Layout — fixed sidebar (240px) + scrollable main column.
 *
 *  ┌───────────────────────────────────────────────┐
 *  │ Sidebar (fixed 240px) │ TopBar (sticky h-14)  │
 *  │                       ├───────────────────────│
 *  │                       │  <children>           │
 *  └───────────────────────────────────────────────┘
 */
const Layout = ({ children }) => (
  <div className="flex min-h-screen" style={{ background: '#050508' }}>
    <Sidebar />
    <div className="flex flex-col flex-1 min-h-screen" style={{ marginLeft: '240px' }}>
      <TopBar />
      <main className="flex-1 p-6 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  </div>
)

export default Layout
