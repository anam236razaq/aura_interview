import React, { createContext, useState, useEffect } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update the <html> tag classes based on the sidebar state
  const updateHtmlClasses = () => {
    const htmlElement = document.documentElement;

    // Ensure default classes are present
    htmlElement.classList.add('layout-navbar-fixed', 'layout-compact', 'layout-menu-fixed');

    // Handle collapsed state
    if (isCollapsed) {
      htmlElement.classList.add('layout-menu-collapsed');
    } else {
      htmlElement.classList.remove('layout-menu-collapsed');
    }

    // Handle hover state
    if (isHovered) {
      htmlElement.classList.add('layout-menu-hover');
    } else {
      htmlElement.classList.remove('layout-menu-hover');
    }

    //Handle expand state
    if(isExpanded){
      htmlElement.classList.add('layout-menu-expanded');
    }else{
      htmlElement.classList.remove('layout-menu-expanded');
    }

    //Handle transition here
    if (isTransitioning) {
      htmlElement.classList.add('layout-transitioning');
    } else {
      htmlElement.classList.remove('layout-transitioning');
    }

  };

  const startTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300); // Match your CSS transition time
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setIsExpanded(false);
    startTransition();
  };

  // Handle mouse enter (hover)
  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  const toggleExpandedSidebar = () => {
    setIsExpanded(prev => !prev);
    startTransition();
  }

  const handleLinkClick = () => {
  if (window.innerWidth < 992) {
    toggleSidebar(); // Collapse sidebar if on small screen
  }
};

  // Update HTML classes whenever state changes
  useEffect(() => {
    updateHtmlClasses();
  }, [isCollapsed, isHovered, isExpanded]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleSidebar,
        handleMouseEnter,
        handleMouseLeave,
        toggleExpandedSidebar,
        isExpanded,
        handleLinkClick
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};