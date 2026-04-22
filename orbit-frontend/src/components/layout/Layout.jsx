import React, { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar  from './TopBar'

/**
 * Layout — fixed sidebar (240px) + scrollable main column.
 */
const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050508', position: 'relative' }}>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Mobile Overlay */}
      {menuOpen && (
        <div 
          className="show-on-mobile"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 35,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            cursor: 'pointer'
          }}
        />
      )}

      <div className="layout-main-mobile" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        minHeight: '100vh', 
        marginLeft: '240px',
        width: 'calc(100% - 240px)'
      }}>
        <TopBar onMenuClick={() => setMenuOpen(true)} />
        <main className="mobile-p-main" style={{ flex: 1, padding: '36px 40px', maxWidth: '100%', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
