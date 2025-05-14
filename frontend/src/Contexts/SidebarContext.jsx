import React, { createContext, useState, useEffect } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
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

  // Update HTML classes whenever state changes
  useEffect(() => {
    updateHtmlClasses();
  }, [isCollapsed, isHovered]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        handleMouseEnter,
        handleMouseLeave,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};