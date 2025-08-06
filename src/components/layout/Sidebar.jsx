'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, ShoppingCart, Subscriptions, Fastfood, Category, Add,
  RateReview, LocalOffer, MoreVert, ExpandMore, ChevronRight
} from '@mui/icons-material';
import { Collapse } from '@mui/material';
import clsx from 'clsx';

const sidebarStructure = [
  {
    items: [
      { title: 'Dashboard', icon: <Home />, href: '/' },
    ],
  },
  {
    headline: 'ORDER MANAGEMENT',
    items: [
      {
        title: 'Regular Orders',
        icon: <ShoppingCart />,
        sublinks: [
          { title: 'All', href: '/order-management/regular-orders/all', count: 13 },
          { title: 'Pending', href: '/order-management/regular-orders/pending', count: 0 },
          { title: 'Confirmed', href: '/order-management/regular-orders/confirmed', count: 2 },
          { title: 'Accepted', href: '/order-management/regular-orders/accepted', count: 0 },
          { title: 'Cooking', href: '/order-management/regular-orders/cooking', count: 1 },
          { title: 'Ready For Delivery', href: '/order-management/regular-orders/ready', count: 4 },
          { title: 'Food On The Way', href: '/order-management/regular-orders/on-the-way', count: 0 },
          { title: 'Delivered', href: '/order-management/regular-orders/delivered', count: 8 },
          { title: 'Dine In', href: '/order-management/regular-orders/dine-in', count: 0 },
          { title: 'Refunded', href: '/order-management/regular-orders/refunded', count: 0 },
          { title: 'Refund Requested', href: '/order-management/regular-orders/refund-requested', count: 2 },
          { title: 'Scheduled', href: '/order-management/regular-orders/scheduled', count: 0 },
          { title: 'Payment Failed', href: '/order-management/regular-orders/payment-failed', count: 0 },
          { title: 'Canceled', href: '/order-management/regular-orders/canceled', count: 0 },
        ],
      },
      {
        title: 'Subscription Orders',
        icon: <Subscriptions />,
        href: '/order-management/subscription-orders',
      },
    ],
  },
  {
    headline: 'FOOD MANAGEMENT',
    items: [
      { title: 'Foods', icon: <Fastfood />, href: '/food-management/foods/list' },
      { title: 'Categories', icon: <Category />, href: '/food-management/categories/category' },
      { title: 'Addons', icon: <Add />, href: '/food-management/addons' },
      { title: 'Reviews', icon: <RateReview />, href: '/food-management/reviews' },
    ],
  },
  {
    headline: 'PROMOTIONS MANAGEMENT',
    items: [
      { title: 'Promotions', icon: <LocalOffer />, href: '/promotions' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openDropright, setOpenDropright] = useState(null);
  const pathname = usePathname();

  // Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };

    handleResize(); // Run initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleDropdown = (key) => setOpenDropdown(openDropdown === key ? null : key);
  const toggleDropright = (key) => setOpenDropright(openDropright === key ? null : key);

  return (
    <aside className={clsx(
      'h-screen bg-gray-900 text-[#E9F3FF] text-[0.88rem] font-[500] flex flex-col z-50 sticky top-0 overflow-y-auto overflow-x-hidden transition-all duration-300',
      collapsed ? 'lg:w-[5%] sm:w-[13%] w-[13%]' : 'sm:w-64 w-[25%]',
      'relative z-40'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 sticky top-0 bg-[#E9F3FF] z-50 h-[60px]">
        <Link href="/">
        <div className="flex items-center gap-2">
          {!collapsed && <img src="/assets/logos/2025-07-22-687f61523c255.png" className="w-11 rounded-md" />}
          {!collapsed && <span className="text-[0.95rem] font-bold text-[#012D5E]">Zohorain</span>}
        </div>
        </Link>
        
        <button onClick={toggleCollapse} className="text-[#012D5E] ml-2 cursor-pointer">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-7 relative py-4 mt-0 bg-[#334257]">
        {sidebarStructure.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="flex items-center justify-between px-2 font-[700] text-[0.75rem] text-gray-400 uppercase">
              {!collapsed ? (
                <span>{section.headline}</span>
              ) : (
                <MoreVert fontSize="small" />
              )}
            </div>

            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;
                const isActive = pathname === item.href;
                const hasSublinks = !!item.sublinks;
                const hasHref = !!item.href;

                return (
                  <div key={key} className="relative">
                    <div
                      className={clsx(
                        'flex items-center justify-between px-2 py-1 hover:text-[#EF853A] text-[0.88rem] rounded-md mt-3 cursor-pointer transition-colors',
                        (isActive || (hasSublinks && item.sublinks.some(sublink => pathname === sublink.href))) && 'bg-[#465468]'
                      )}
                      onClick={(e) => {
                        if (collapsed && hasSublinks) {
                          e.preventDefault();
                          toggleDropright(key);
                        } else if (!collapsed && hasSublinks) {
                          e.preventDefault();
                          toggleDropdown(key);
                        }
                      }}
                    >
                      {/* Main link with href */}
                      <div className="flex items-center gap-3 flex-1">
                        {hasHref ? (
                          <Link 
                            href={item.href} 
                            className="flex items-center gap-3 flex-1"
                            onClick={(e) => {
                              if (hasSublinks) {
                                e.preventDefault();
                                if (collapsed) toggleDropright(key);
                                else toggleDropdown(key);
                              }
                            }}
                          >
                            <span className="hover:text-[#EF853A]">{item.icon}</span>
                            {!collapsed && <span>{item.title}</span>}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 flex-1">
                            <span className="hover:text-[#EF853A]">{item.icon}</span>
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                        )}
                      </div>
                      
                      {/* Dropdown indicator */}
                      {!collapsed && hasSublinks && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(key);
                          }}
                          className="text-gray-400 ml-2"
                        >
                          {openDropdown === key ? <ExpandMore /> : <ChevronRight />}
                        </button>
                      )}
                    </div>

                    {/* Expanded Mode */}
                    {!collapsed && hasSublinks && (
                      <Collapse in={openDropdown === key}>
                        <div className="ml-8 mt-1 space-y-1 w-fit">
                          {item.sublinks.map((sublink, subIndex) => (
                            <Link
                              key={subIndex}
                              href={sublink.href}
                              className={clsx(
                                'group flex justify-between gap-7 items-center px-0 py-1 rounded hover:bg-gray-700 hover:text-[#EF853A] transition-colors',
                                pathname === sublink.href && 'bg-gray-700'
                              )}
                            >
                              <div className="flex items-center gap-2 text-[0.80rem]">
                                <span className="w-1 h-1 bg-white rounded-full group-hover:bg-[#EF853A]" />
                                <span>{sublink.title}</span>
                              </div>
                              <span className="text-[0.60rem] bg-blue-500 text-white px-2 py-1 rounded-full">
                                {sublink.count}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </Collapse>
                    )}

                    {/* Collapsed Dropright Mode */}
                    {collapsed && hasSublinks && openDropright === key && (
                      <div className="fixed left-22 top-auto z-50 bg-[#334257] rounded shadow-lg w-[255px]">
                        <div className="p-4 space-y-2">
                          {item.sublinks.map((sublink, subIndex) => (
                            <Link
                              key={subIndex}
                              href={sublink.href}
                              className={clsx(
                                'group flex justify-between items-center px-2 py-1 rounded hover:text-[#EF853A] transition-colors',
                                pathname === sublink.href && 'bg-gray-700'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-white rounded-full group-hover:bg-[#EF853A]" />
                                <span className="text-[0.80rem]">{sublink.title}</span>
                              </div>
                              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                {sublink.count}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 3px;
        }
        aside::-webkit-scrollbar-track {
          background: #334257;
        }
        aside::-webkit-scrollbar-thumb {
          background: #8590A0;
          border-radius: 0px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #8590A0;
        }
      `}</style>
    </aside>
  );
}