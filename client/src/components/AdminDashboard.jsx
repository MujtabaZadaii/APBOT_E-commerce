import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, FolderKanban, TrendingUp, 
  Megaphone, Tag, Star, FileText, Settings, ExternalLink, LogOut, Search, 
  Bell, Mail, Maximize, Calendar, Download, DollarSign, ArrowUpRight, ArrowDownRight, 
  Bot, Sparkles, CheckCircle2, Clock, ShieldCheck, ChevronDown, Filter
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard({ currentUser, onSignOut, onGoToStore }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('May 10, 2025 - May 16, 2025');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch admin stats", err);
        setLoading(false);
      });
  }, []);

  const summary = stats?.summary || {
    totalRevenue: 128430.00,
    totalOrders: 1243,
    totalCustomers: 832,
    totalProducts: 258,
    avgOrderValue: 103.35
  };

  const apbotAnalytics = stats?.apbotAnalytics || {
    mostDiscussedProduct: 'Rift Overshirt',
    mostDiscussedProductQueryCount: 342,
    topQueryIntent: 'add_to_cart & size_fit',
    itemsAddedToCartByBot: 184,
    botConversionRate: '34.8%'
  };

  const topProducts = stats?.topProducts || [
    { id: '1', name: 'Cashmere Overcoat', price: 489.00, sold: 128 },
    { id: '2', name: 'Wool Blend Jacket', price: 329.00, sold: 96 },
    { id: '3', name: 'Merino Knit Sweater', price: 179.00, sold: 74 },
    { id: '4', name: 'Tailored Trousers', price: 159.00, sold: 62 },
    { id: '5', name: 'Leather Chelsea Boots', price: 219.00, sold: 48 }
  ];

  const recentOrders = stats?.recentOrders?.length > 0 ? stats.recentOrders : [
    { _id: 'SBL-12543', customerName: 'Ahmad Raza', createdAt: 'May 16, 2025', totalAmount: 489.00, status: 'Delivered' },
    { _id: 'SBL-12542', customerName: 'Sara Khan', createdAt: 'May 16, 2025', totalAmount: 179.00, status: 'Processing' },
    { _id: 'SBL-12541', customerName: 'Hamza Ali', createdAt: 'May 15, 2025', totalAmount: 329.00, status: 'Shipped' },
    { _id: 'SBL-12540', customerName: 'Ayesha Malik', createdAt: 'May 15, 2025', totalAmount: 249.00, status: 'Processing' },
    { _id: 'SBL-12539', customerName: 'Usman Tariq', createdAt: 'May 15, 2025', totalAmount: 159.00, status: 'Pending' }
  ];

  return (
    <div className="sable-admin-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand-header">
          <span className="admin-logo">SABLE</span>
        </div>

        <nav className="admin-nav-menu">
          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
            <span className="admin-badge">23</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Customers</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'apbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('apbot')}
          >
            <Bot size={18} className="gold-text" />
            <span className="gold-text">ApBot AI Intelligence</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'discounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('discounts')}
          >
            <Tag size={18} />
            <span>Discounts</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Bottom Store Switcher */}
        <div className="admin-store-card">
          <div className="admin-store-title">SABLE</div>
          <p className="admin-store-sub">Timeless design. Conscious creation.</p>
          <button type="button" className="admin-view-store-btn" onClick={onGoToStore}>
            <span>View Store</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Admin Profile Footer */}
        <div className="admin-user-profile">
          <div className="admin-avatar">
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'} 
              alt="Admin Avatar" 
            />
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">{currentUser?.name || 'Mujtaba Zadai'}</span>
            <span className="admin-user-role">Super Administrator</span>
          </div>
          <button type="button" className="admin-logout-btn" onClick={onSignOut} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-main-content">
        
        {/* Top Header Controls Bar */}
        <header className="admin-top-bar">
          <div className="admin-page-title-wrap">
            <h1 className="admin-page-title">Welcome back, Admin</h1>
            <p className="admin-page-sub">Here's what's happening with your store today.</p>
          </div>

          <div className="admin-top-controls">
            <div className="admin-search-box">
              <Search size={16} />
              <input type="text" placeholder="Search anything... ⌘K" />
            </div>

            <div className="admin-date-picker">
              <Calendar size={14} />
              <span>{dateRange}</span>
              <ChevronDown size={14} />
            </div>

            <button type="button" className="admin-btn-export">
              <Download size={14} />
              <span>Export Report</span>
            </button>

            <div className="admin-icon-badge" title="Notifications">
              <Bell size={18} />
              <span className="badge-dot">3</span>
            </div>
          </div>
        </header>

        {/* 3. KPI METRICS ROW (5 CARDS WITH SPARK LINES) */}
        <div className="admin-kpi-grid">
          {/* Card 1: Revenue */}
          <div className="admin-kpi-card">
            <div className="kpi-card-head">
              <span className="kpi-icon"><DollarSign size={16} /></span>
              <span className="kpi-title">TOTAL REVENUE</span>
            </div>
            <div className="kpi-value">£{summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>18.2% vs last week</span>
            </div>
            <svg className="kpi-sparkline" viewBox="0 0 100 25">
              <path d="M0,20 Q15,18 30,12 T60,8 T90,3 T100,5" fill="none" stroke="#D8C5A2" strokeWidth="2" />
            </svg>
          </div>

          {/* Card 2: Orders */}
          <div className="admin-kpi-card">
            <div className="kpi-card-head">
              <span className="kpi-icon"><ShoppingBag size={16} /></span>
              <span className="kpi-title">TOTAL ORDERS</span>
            </div>
            <div className="kpi-value">{summary.totalOrders.toLocaleString()}</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>14.6% vs last week</span>
            </div>
            <svg className="kpi-sparkline" viewBox="0 0 100 25">
              <path d="M0,22 Q20,15 40,18 T70,9 T100,2" fill="none" stroke="#D8C5A2" strokeWidth="2" />
            </svg>
          </div>

          {/* Card 3: Customers */}
          <div className="admin-kpi-card">
            <div className="kpi-card-head">
              <span className="kpi-icon"><Users size={16} /></span>
              <span className="kpi-title">TOTAL CUSTOMERS</span>
            </div>
            <div className="kpi-value">{summary.totalCustomers.toLocaleString()}</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>9.8% vs last week</span>
            </div>
            <svg className="kpi-sparkline" viewBox="0 0 100 25">
              <path d="M0,24 Q25,20 50,14 T80,8 T100,4" fill="none" stroke="#D8C5A2" strokeWidth="2" />
            </svg>
          </div>

          {/* Card 4: Products */}
          <div className="admin-kpi-card">
            <div className="kpi-card-head">
              <span className="kpi-icon"><Package size={16} /></span>
              <span className="kpi-title">TOTAL PRODUCTS</span>
            </div>
            <div className="kpi-value">{summary.totalProducts.toLocaleString()}</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>5.1% vs last week</span>
            </div>
            <svg className="kpi-sparkline" viewBox="0 0 100 25">
              <path d="M0,18 Q30,12 60,16 T90,7 T100,5" fill="none" stroke="#D8C5A2" strokeWidth="2" />
            </svg>
          </div>

          {/* Card 5: Avg Order Value */}
          <div className="admin-kpi-card">
            <div className="kpi-card-head">
              <span className="kpi-icon"><Tag size={16} /></span>
              <span className="kpi-title">AVG. ORDER VALUE</span>
            </div>
            <div className="kpi-value">£{summary.avgOrderValue.toFixed(2)}</div>
            <div className="kpi-trend negative">
              <ArrowDownRight size={14} />
              <span>2.4% vs last week</span>
            </div>
            <svg className="kpi-sparkline" viewBox="0 0 100 25">
              <path d="M0,8 Q20,12 40,16 T70,20 T100,22" fill="none" stroke="#EF4444" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* 4. APBOT AI CONVERSATION & INTELLIGENCE HIGHLIGHT CARD */}
        <div className="admin-apbot-banner">
          <div className="apbot-banner-left">
            <div className="apbot-badge-icon">
              <Bot size={24} color="#D8C5A2" />
            </div>
            <div>
              <div className="apbot-banner-title">
                <span>APBOT AI INTELLIGENCE OVERVIEW</span>
                <Sparkles size={14} color="#D8C5A2" />
              </div>
              <p className="apbot-banner-sub">
                ApBot actively analyzed 1,420 conversations with 98.6% intent prediction accuracy and Roman Urdu speech comprehension.
              </p>
            </div>
          </div>

          <div className="apbot-metrics-row">
            <div className="apbot-metric-box">
              <span className="apbot-m-label">MOST DISCUSSED ITEM</span>
              <span className="apbot-m-val">{apbotAnalytics.mostDiscussedProduct}</span>
              <span className="apbot-m-sub">342 Bot Chats</span>
            </div>

            <div className="apbot-metric-box">
              <span className="apbot-m-label">TOP BOT INTENT</span>
              <span className="apbot-m-val">Add to Bag</span>
              <span className="apbot-m-sub">184 Direct Additions</span>
            </div>

            <div className="apbot-metric-box">
              <span className="apbot-m-label">BOT CONVERSION RATE</span>
              <span className="apbot-m-val gold">{apbotAnalytics.botConversionRate}</span>
              <span className="apbot-m-sub">High Purchase Intent</span>
            </div>
          </div>
        </div>

        {/* 5. CHARTS ROW (REVENUE OVERVIEW + SALES BY CATEGORY + TOP PRODUCTS) */}
        <div className="admin-charts-grid">
          
          {/* Revenue Overview Chart */}
          <div className="admin-card chart-card">
            <div className="card-header">
              <h3>Revenue Overview</h3>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot gold" /> This Week</span>
                <span className="legend-item"><span className="dot grey" /> Last Week</span>
              </div>
            </div>
            <div className="line-chart-container">
              <svg viewBox="0 0 500 200" className="revenue-svg-chart">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

                {/* Last Week Line */}
                <path 
                  d="M10,160 L85,135 L160,120 L235,90 L310,105 L385,130 L460,115" 
                  fill="none" stroke="#4A4A4A" strokeWidth="2" strokeDasharray="4 4"
                />

                {/* This Week Line */}
                <path 
                  d="M10,130 L85,95 L160,85 L235,45 L310,60 L385,110 L460,80" 
                  fill="none" stroke="#D8C5A2" strokeWidth="3"
                />

                {/* Data Points */}
                <circle cx="235" cy="45" r="5" fill="#D8C5A2" stroke="#101010" strokeWidth="2" />
                <circle cx="310" cy="60" r="4" fill="#D8C5A2" />
                <circle cx="160" cy="85" r="4" fill="#D8C5A2" />
              </svg>
              <div className="chart-x-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Sales by Category Donut Chart */}
          <div className="admin-card chart-card">
            <div className="card-header">
              <h3>Sales by Category</h3>
            </div>
            <div className="donut-chart-flex">
              <div className="donut-svg-wrap">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#252422" strokeWidth="14" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#D8C5A2" strokeWidth="14" strokeDasharray="90 150" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#8A8781" strokeWidth="14" strokeDasharray="50 190" strokeDashoffset="-90" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#55534E" strokeWidth="14" strokeDasharray="40 200" strokeDashoffset="-140" />
                </svg>
                <div className="donut-center-text">
                  <span className="donut-val">£128,430</span>
                  <span className="donut-lbl">Total Sales</span>
                </div>
              </div>

              <div className="donut-legend">
                <div className="legend-row">
                  <span className="legend-sq" style={{ background: '#D8C5A2' }} />
                  <span>Outerwear</span>
                  <b className="pct">38%</b>
                </div>
                <div className="legend-row">
                  <span className="legend-sq" style={{ background: '#8A8781' }} />
                  <span>Knitwear</span>
                  <b className="pct">22%</b>
                </div>
                <div className="legend-row">
                  <span className="legend-sq" style={{ background: '#55534E' }} />
                  <span>Tailoring</span>
                  <b className="pct">18%</b>
                </div>
                <div className="legend-row">
                  <span className="legend-sq" style={{ background: '#3A3935' }} />
                  <span>Accessories</span>
                  <b className="pct">12%</b>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products List */}
          <div className="admin-card top-products-card">
            <div className="card-header">
              <h3>Top Products</h3>
              <button type="button" className="btn-link">View all</button>
            </div>
            <div className="top-products-list">
              {topProducts.map(p => (
                <div key={p.id} className="top-product-item">
                  <img src={p.image || '/images/sable_about_hero.png'} alt={p.name} />
                  <div className="tp-info">
                    <span className="tp-name">{p.name}</span>
                    <span className="tp-price">£{p.price.toFixed(2)}</span>
                  </div>
                  <div className="tp-stat">
                    <span className="tp-sold">{p.sold}</span>
                    <span className="tp-label">Sold</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. BOTTOM ROW (RECENT ORDERS + CUSTOMER GROWTH + ACTIVITY FEED) */}
        <div className="admin-bottom-grid">
          
          {/* Recent Orders Table */}
          <div className="admin-card orders-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button type="button" className="btn-link">View all orders</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, idx) => (
                  <tr key={idx}>
                    <td className="order-id">#{o._id.slice(-8)}</td>
                    <td className="customer-cell">
                      <div className="cust-avatar">{o.customerName ? o.customerName[0] : 'U'}</div>
                      <span>{o.customerName || 'SABLE Customer'}</span>
                    </td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'May 16, 2025'}</td>
                    <td className="order-amount">£{(o.totalAmount || o.tp || 185).toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${o.status ? o.status.toLowerCase() : 'delivered'}`}>
                        {o.status || 'Delivered'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Growth Bar Chart */}
          <div className="admin-card growth-card">
            <div className="card-header">
              <h3>Customer Growth</h3>
              <span className="bar-sub">Monthly</span>
            </div>
            <div className="bar-chart-container">
              <div className="bar-col"><div className="bar" style={{ height: '40%' }} /><span className="b-lbl">Dec</span></div>
              <div className="bar-col"><div className="bar" style={{ height: '55%' }} /><span className="b-lbl">Jan</span></div>
              <div className="bar-col"><div className="bar" style={{ height: '70%' }} /><span className="b-lbl">Feb</span></div>
              <div className="bar-col"><div className="bar" style={{ height: '80%' }} /><span className="b-lbl">Mar</span></div>
              <div className="bar-col"><div className="bar" style={{ height: '88%' }} /><span className="b-lbl">Apr</span></div>
              <div className="bar-col"><div className="bar gold" style={{ height: '100%' }} /><span className="b-lbl">May</span></div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="admin-card activity-card">
            <div className="card-header">
              <h3>Activity Feed</h3>
            </div>
            <div className="activity-list">
              <div className="act-item">
                <div className="act-icon"><ShoppingBag size={14} /></div>
                <div className="act-text">
                  <p>New order #SBL-12543 placed</p>
                  <span>2 min ago</span>
                </div>
              </div>

              <div className="act-item">
                <div className="act-icon warning"><Package size={14} /></div>
                <div className="act-text">
                  <p>Product "Cashmere Overcoat" low in stock</p>
                  <span>15 min ago</span>
                </div>
              </div>

              <div className="act-item">
                <div className="act-icon"><Users size={14} /></div>
                <div className="act-text">
                  <p>New customer Ahmad Raza registered</p>
                  <span>1 hour ago</span>
                </div>
              </div>

              <div className="act-item">
                <div className="act-icon"><Star size={14} /></div>
                <div className="act-text">
                  <p>Review received for "Wool Blend Jacket"</p>
                  <span>3 hours ago</span>
                </div>
              </div>

              <div className="act-item">
                <div className="act-icon gold"><Bot size={14} /></div>
                <div className="act-text">
                  <p>ApBot resolved 42 customer size queries</p>
                  <span>4 hours ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
