import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['o', 'ov'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Mix',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'mixer',
    isActive: true,
    items: [
      {
        title: 'Manual',
        url: '/dashboard/mix/manual',
        icon: 'manual',
        shortcut: ['m', 'm']
      },
      {
        title: 'Recipe',
        shortcut: ['mr', 'mrc'],
        url: '/dahsboard/mix/recipe',
        icon: 'bottle'
      }
    ]
  },
  {
    title: 'Recipes',
    url: '/dashboard/recipes',
    icon: 'recipe',
    shortcut: ['r', 'rec'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Logs',
    url: '/dashboard/logs',
    icon: 'log',
    shortcut: ['l', 'lo'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    shortcut: ['s', 'se'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'FAQ',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'faq',
    isActive: false,

    items: [
      {
        title: 'What is Kanaeru Dispenser?',
        url: '/dashboard/faq/kanaeru',
        icon: 'lora',
        shortcut: ['wl', 'wl']
      },
      {
        title: 'How it works?',
        shortcut: ['ha', 'ha'],
        url: '/dashboard/faq/works',
        icon: 'infra' 
      },
      {
        title: 'What is this app for?',
        shortcut: ['ap', 'ap'],
        url: '/dashboard/faq/app',
        icon: 'infra' 
      },
      {
        title: 'How to use this app?',
        shortcut: ['us', 'us'],
        url: '/dashboard/faq/use',
        icon: 'infra' 
      },
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
];
