---
name: nextjs-structure
description: best practices for structuring a next.js project, including file organization, component structure. use when restructring part of the project or the user is asking to add/modify a feature that requires dependencies such as using a third party tool, look at the tech stack section to make sure the new dependencies are compatible with the existing tech stack and follow the best practices for next.js development. also if the user is adding pages or components, follow the file structure and styling structure outlined in this skill and the nextjs-css-globals skill. or if the user is asking to fix bugs in existing code, make sure to follow the best practices outlined in this skill and the nextjs-css-globals skill when making changes to the code. also make sure to keep the file structure and styling structure consistent with the rest of the project when making changes.
---

## best practices for nextjs
- use functional components and hooks for state management and side effects
- create reusable/named components wherever possible to avoid duplication, improve readability, and make the code more maintainable.
- use contexts and providers for managing global state and passing data down the component tree
- use nextjs's built-in routing system for navigation between pages and dynamic routes for project pages and media pages
- use the nextjs app routing system to organize pages and components in an intuitive way. multiple levels of nesting if needed
- any page.tsx files should not have 'use client'. client side rendering should happen in components, not pages.
- use environment variables for sensitive information and configuration settings
- implement server-side rendering (SSR) or static site generation (SSG) as needed for performance and SEO benefits
- use CSS modules or styled-components for styling to avoid global CSS conflicts
- implement error handling and loading states as well as skeleton UI for better user experience
- optimize performance by code splitting and lazy loading components as needed. aim to keep the website fast and responsive, especially since it will be media-heavy with animations and images. aim to keep code file sizes small and efficient, around 100-200 lines max per file, and break up components into smaller reusable pieces as needed. use colocation of components and styles to keep things organized and maintainable.
- use typescript
- implement accessibility best practices to ensure the website is usable for all users, including those with disabilities. this includes using semantic HTML, providing alt text for images, ensuring sufficient color contrast, and making sure the website is navigable via keyboard.
- use tailwind css for styling to allow for rapid development and easy customization of the website's design. tailwind's utility-first approach will help in creating unique and unconventional layouts while maintaining a clean and cohesive design. it also allows for easy responsive design, which is important for ensuring the website looks great on all devices. refer to the styling structure section for more details.
- ensure that the website is mobile-friendly and responsive, as many users may be accessing it from their phones or tablets. use media queries and responsive design techniques to ensure that the layout and content adapt well to different screen sizes and orientations. test the website on various devices to ensure a consistent and enjoyable user experience across all platforms.
- all files should be under src. so src/app, src/components, src/hooks, src/types, src/lib, etc. the import path convention should be like @/app, @/components, @/hooks, @/types, @/lib, etc. to keep imports clean and organized. avoid relative import paths like ../../../components/Button, instead use absolute import paths with the @ alias. this will make it easier to move files around without having to update import paths and will improve readability of the code. set up the jsconfig.json file to configure the baseUrl and paths for the @ alias.

## styling structure
- for writing css, follow the nextjs-css-globals skill for setting up global styles and using css modules for component specific styles. use the tailwind layer structure to organize styling tokens and classes. no hardcoding values in components, instead use the tailwind utilities and css variables defined in the globals.css file. this will keep styles consistent and make it easier to manage as the website grows and evolves.
- create a main components directory for reusable components such as buttons, cards, modals, etc.