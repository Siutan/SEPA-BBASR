# SEPA Project 27 Template

## Contents
- [Very Important Information](#Very-Important-Information)
- [General Information](#General-Information)
- [Requirements](#Requirements)
- [Installation](#Installation)
- [Other Things You Will Need To Know](#Other-things-you-will-need-to-know)

# Very Important Information

### Please Increment the version of both the web app and the android app for any Major and/or Minor pushes!
###### The android version can be incremented by running yarn cap:sync

#### The versioning Guide we will use is:

- Version will start at 1.0.0 and will follow the rule: [Major].[Minor].[Patch]-[Build].[BuildNumber]
- ### Major version changes will include:
  - Breaking backwards compatability (e.g. API changes or major package changes ). Generally we shouldn't need to increment this.
- ### Minor version changes will include:
  - Major styling changes (e.g. color themes, etc)
  - Addition of new features and (e.g. the addition of a customer page would change the version from 1.0.0 to 1.1.0).
    The new features **do not** have to be complete for this version change.
- ### Patch version changes will likely be the most common and will include:
  - Bugfixes (self-explanatory)
  - Minor style changes (e.g. changing form colors, layout, etc)
  - QoL changes (self-explanatory)
- ### Build Version and Build Number changes are as follows:
  - these changes will happen **only** in development and will be removed
    when pushed to the Master branch.
  - This applies to any build that is not in Master. for example while a new Minor feature is being developed,
    it's version might be 1.2.4-Dev1.2, but after it gets approved, it will be pushed to Master as 1.3.0.

# General Information

- We will be using [Yarn](https://yarnpkg.com/getting-started) as our package manager.
  This is because yarn of Yarn's approach to dependency installation as well as Yarn workspaces
  for custom modules.
- You are free to use any IDE you'd like, the current `.gitignore` is configured for Jetbrains Webstorm
  so please amend it accordingly.

# Requirements

The list of software, packages, etc. you'll need to get this project started,
Links to their respective download pages are provided.

- [NodeJS](https://nodejs.org/en/) (16.4.0 or higher, Use the LTS version if you're unsure.)
- [Yarn](https://yarnpkg.com/getting-started/install) (The other way to install yarn is:
  `npm install -g yarn` This will install Yarn globally onto your system. To check if it installed properly,
  you can try `yarn -v` to check its version)
- I recommend [Android studio](https://developer.android.com/studio) since it's easy to set up, and you might have worked with it before,
  but feel free to choose your own Android development environment if you'd like.
  keep in mind though Capacitor, the framework we'll be using for the android development, favours Android Studio.
  You can choose to use an emulator or if you have an android device, you can enable USB debugging as use that instead.

# Installation

1. Clone Repo
2. Run `yarn` to install dependencies
3. ### For Web App:

```bash
# You can run it in dev by using:
yarn dev

# Using --open will open the web app in your browser when you run it:
yarn dev --open

# Using --host will allow you to open the web app to your local network
# for viewing on your phone or another device:
yarn dev --host

# Using --port will start the web app on your specified port:
yarn dev --port 5000

# You can use any combination of the above to suit your needs:
yarn dev --open --host --port 5000
```

4. ### For Mobile App:

- #### Android:

  ##### First time setup:

  ```bash
  # First build the web app:
  yarn build

  # Then create the files necessary for android development:
  npx cap add android

  # sync the projects together
  yarn cap:sync

  # Open android project in android studio to run on a mobile device or emulator
  npx cap open android
  ```

  ##### After initial setup:

  ```bash
    # Just sync before you run the app
    yarn cap:sync

    # Then open the app in Android Studio to run it
    npx cap open android
  ```

- #### iOS:

  ##### First time setup:

  ```bash
  # First build the web app:
  yarn build

  # Then create the files necessary for iOS development:
  npx cap add ios

  # sync the projects together
  yarn cap:sync

  # Open iOS project in Xcode to run on a mobile device or emulator
  npx cap open ios
  ```

  ##### After initial setup:

  ```bash
    # Just sync before you run the app
    yarn cap:sync

    # Then open the app in Xcode to run it
    npx cap open ios
  ```

# Other things you will need to know

### Tailwind CSS

- We will be using Tailwind CSS for our UI styling.
  This is a CSS framework that allows you to easily style your UI components.
  It's a great tool for styling your UI components.
  You can find more information about Tailwind CSS [here](https://tailwindcss.com/docs/introduction).
- TW-elements is a sort of bootstrap library for tailwind components.
  You can find more information about tw-elements [here](https://tailwind-elements.com/docs/standard/components/accordion/).
- Tailwind uses a **mobile first** approach.
  This means that you can use Tailwind CSS on mobile devices and desktop devices.
  You can find more information about mobile first [here](https://tailwindcss.com/docs/responsive-design).

### Sveltekit

- The way svelte works is different to the other major frameworks. This means
  that certain components might need to be specifically designed or changed to work with svelte.
  A good resource to find compatible components is [madeWithSvelte](https://madewithsvelte.com/).
  Feel free to use any plugins or components that you like from there or the NPM registry.
