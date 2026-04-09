## about this app
This is primarily a professioinal animation portfolio for a skilled animator called Kristin Thaeler who is looking to showcase their extensive range of ability and experience. Ths artist wants to do freelance work. Her penname is firresketches. secondly, its a place for the the artist to store/display/archive/organize collections of media with detailed descriptor options

## other context
the artist's current portfolio is located at https://kristinthaeler.weebly.com/about.html. This website should be much more visually aesthetic and organized. the artist wants users to be mainly drawn to the film/animation projects. primary target audience is people looking to hire this artist, but is also a place for anyoen to browse the artist's work.

## features to include
- the main landing page should showcase the artist's lastest work or their work of choice.
- the artist has a few categories of media including polished films, animations of varying degrees, animatics, gifs, static images. the uploaded media (stuff uploaded via local file manager) are stored in the R2 bucket storage.
- the main items in the navbar should dropdown on hover to show the subpages. this dropdown can be elaborate components to help the user nevigate the website. the subpages can be multiple levels of nesting.
- the gallary should have several subpages, but the main pages/subpages should display the artist's film and animation projects. each project can have its own page aw well, and a any piece of media can be linked to a project and/or collection(s). the user can also browse through galleries of the artist's other works and collections but this is not a main feature of the website, more of an extra thing.
- have social media galleries as well. for example, have a page that shows all the artist's instagram posts
- display links to her socials such as instagram, linkedin
- the contact or get in touch section/page should allow users to conveniently write and send a message to the artist via email
- the about me section should show the artist's picture of choice and description. The contact section can also be merged with the about me section along with an optional resume component. the about me section is also a chance for the artist to include anything they want like hobbies, preferences, inspirations, etc.
- a page/section where the artist can showcase their skills/achievements whether its animation softwares used, educational achievements, job experience, events attended, people collaborated with, anything else notable
- a prominent page/section for the artist to pitch themselves and possibly pricing in terms of work. a main focus across the website is the artist pitching themselves to potential clients. so there should be a section where users can see what services the artist is selling and how they can get in touch with the artist and what other requirements there are to hire the artist. Right now it is not very formal work so the artist is mainly looking for freelance contracts on projects. the services should have an enquire button that takes them to the contact section
- an artist admin page should provide a content editor for the artist to have direct access to adding/managing/deleting certain sections/pages of the website so that the developer does not have to go in and hardcode values everytime the artist has an update for the website. the artist can edit details about sections and the individual media. For example, the artist should be able to edit the creation/update date, add descriptions, links, and other information about sections/media. the artist should be able to organize their art in collections and subcollections which, on the user side, the user will be able to explore. but in order to avoid redundant actions from the artist (setting values in multiple places). the artist can also archive pieces of media and switch out media. for example if an image has a name, description and some links, the artist can replace the image while keeping the other details. besides archiving content, the artist can also just hide the content if for some reason they dont want the users to see a certain section or its a work in progress. the artist can also choose to show/hide certain instagram posts on the instagram posts gallery. the artist can also select from different sources (their instagram posts, google drive, etc) in sections/collections/project pages/etc. the artist admin page is where the artist can also update their details such as email, resume, social media links, and anything else. the admin page is also where the artist can also manage their service offerings and pitchings. they can type these commission offerings manually or upload pdfs or images or link their embed instagram posts.


## ui requirements
- instead of using a preset jekyll theme, use custom theme
- the ui should feel clean but full of character, highlighting the artist work. 
- create unique and unconventional layouts to make browsing the website more fun.
- the navigation should feel intuitive, flowy, and seamless. Focus on presenting and emphasizing the content. think about the user's experience as the user scrolls through a page, and consider what belongs or doesnt belong on a single page.
- use gallery components like carousels, collage style, and any other components you can think of. 
- use skeleton ui if components/media are loading. make sure any videos like the .mp4 or .mov medias have thumbnails

## things to avoid
- avoid generic shapes, borders, color combos, etc. avoid the generic panels with thin outline generic ui and avoid the compoent single side border coloring.
- avoid cognitive overload. this is an artist portfolio, so unless its intentionally a gallery or collection of images, the content being shown to the user should feel intentional and focused on a specific piece of content.

## current tech stack
- jekyll markdown
- cloudeflare R2 bucket for storage of animations/images throughout the app
- deployed on github pages, committing and pushing updates prod instantly


## tech stack (current)
- next.js 15 (app router), typescript, react 19
- deployed on cloudflare pages
- cloudflare R2 (via r2-worker) for all media storage
- cloudflare D1 (sqlite) for all non-media data — see schema.sql
- cloudflare access protecting /admin/* (no custom auth code needed — already authenticated by the time requests reach the app)
- behold.so for embedding instagram posts
- @cloudflare/next-on-pages adapter for next.js + cloudflare pages

## styling
- tailwind css v4 (css-based config in globals.css, no tailwind.config.ts)
- globals.css uses: @layer theme → @theme inline → @layer base → @layer components
- HSL palette: ember (primary/accent), gold (secondary), ink/dusk/smoke/ash/haze/mist (dark scale)
- use semantic tailwind tokens only: bg-background, text-foreground, bg-surface, text-muted, bg-primary, text-primary-foreground, border-border, etc.
- never use hardcoded hex/rgb/var(--x) inline in components — always use the token names
- framer-motion for animations
- css component libraries available: shadcn/ui, reactbits.dev, magicui.design, uiverse.io
- css modules go in a customStyles/ folder for component-specific styles
- page-specific components live in the same folder as the page (colocation), shared components in src/components/

## file structure
- all source under src/: src/app, src/components, src/lib, src/types, src/hooks
- import alias: @/* → ./src/* (configured in tsconfig.json)
- page.tsx files must NOT have 'use client' — client rendering goes in components only


## follow these best practices
- rate limit messaging in the contact section
- follow the nextjs-structure skill if developer wants to migrate from current tech stack to ideal tech stack
