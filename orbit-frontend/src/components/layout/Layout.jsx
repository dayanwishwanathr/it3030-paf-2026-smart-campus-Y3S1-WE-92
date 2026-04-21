import Sidebar from './Sidebar'
import TopBar  from './TopBar'

/**
 * Layout — fixed sidebar (240px) + scrollable main column.
 */
const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#050508' }}>
    <Sidebar />
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1, 
      minHeight: '100vh', 
      marginLeft: '240px',
      width: 'calc(100% - 240px)'
    }}>
      <TopBar />
      <main style={{ flex: 1, padding: '28px 32px', maxWidth: '100%', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  </div>
)

export default Layout
