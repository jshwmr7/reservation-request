
import React from 'react';

export const Sidebar = () => {
  const menuItems = [
    "1-to-1 Asset Manager",
    "FMX Maps",
    "Reservation Finder",
    "Calendar",
    "To-Do List",
    "Work List"
  ];

  return (
    <div className="w-64 min-h-screen bg-sidebar-background text-sidebar-foreground p-6">
      <div className="mb-8">
        <img 
          src="/lovable-uploads/4a7db52c-f46c-4061-9c89-deeb179b255f.png" 
          alt="FMX Logo" 
          className="w-32 mx-auto"
        />
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            className="w-full text-left px-4 py-2 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};
