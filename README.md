> [!IMPORTANT]
> DO NOT FORK, please download this repository and import it to your personal account.


# cside-interview Template

Thanks for applying to c/side! While basic, this template resembles high-level of what c/side's fullstack experience would look like. This defines a very good starting point for your homework assignment so you can focus on writing the application rather than making the foundation of the app.

## What you are building

You are building a simple application that displays information about a GitHub repository. The application should be able to do the following:

- Search any repository on GitHub
- Display the basic information about the repository
  - Name
  - Description
  - Number of stars & forks
  - Number of branches
  - Number of commits
  - Display and list the contributors profile picture
  - Paginate and list the issues in on a new page (up-to 10 items at a time)
    - Be able to view a specific issue's:
      - Title
      - Description
      - Creation date
      - Tags
      - Paginate discussions of the issue up-to 5 items at a time with a "load more" button:
        - Commentor's name
        - Commentor's profile picture
        - Comment's created at
        - Comment's body

## Getting Started / Good-to-Know

> [!IMPORTANT]
> This template SHOULD NOT BE PUBLISHED ONLINE. Since this is a frontend-only application, if you publish it online, your GitHub token will be publicly available via the Network tab of the browser's developer tools. 

This template uses:
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Relay](https://relay.dev/)
- [Tailwind](https://tailwindcss.com/)
- [TanStack Router](https://tanstack.com/router/v1)
- [Biome](https://biomejs.dev/)

> [!NOTE]
> There is not a design system for this. You are free to use whatever you'd like for UI. We personally use build most of our components in house, but do use [Radix UI](https://www.radix-ui.com/) for some components. Also note that this does not need to be particularly pretty, but should not look subjectively bad either.

You can add as many packages as you'd like, but you must adhere to using Vite, React and Relay at the minimum.

To get started, follow these steps:

1. Clone this repository
2. Rename/duplicate the `.env.example` file to `.env`
   1. Create a GitHub token with at the very least the `repo` and `user` scopes
   2. Copy the token and paste it into the `.env` file
3. Run `pnpm install` to install the dependencies
4. Run `pnpm dev` to start the development server
   1. This runs Vite in development mode and relay's compiler in watch mode. Any changes you make to a query/mutation/fragment will be automatically compiled and the application will be updated.
5. Open your browser to `http://localhost:5173`
6. Get to cooking!


> [!NOTE]
> You are not creating an API for this application. But rather interacting with GitHub's GraphQL API (Read the docs [here](https://docs.github.com/en/graphql)). At c/side, you will be creating queries and mutations for the API, but for the sake of your time, we will be interacting with GitHub's API.
