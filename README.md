> 🚨 This package is constantly improving, feel free to submit bugs and ideas! 🚨

# TheFlyingCoder's Git npx  

Initialising your accelerators with a single npx command!

If you are like me, you've got an accelerator you use ALL the time, maybe even multiple! 

Whenever I wanted to share my accelerators, or re-use my own, it'd require
cloning the repo from github, and that's about 6 clicks too many for my liking so instead I made this.

To try it out just use the npx installer:

`npx git-npx <project-name>`

**What are the steps??**  

1. Create your accelerator
2. Put it on a public github repo
3. Create the NPM installer package with `npx git-npx <project-name>`
4. Go into the package.json and update all the details, most importantly:
    * **name**: This will be your npm installer package name
    * **bin/git-npx**: Rename the key `"git-npx"` to match your package name
    * **repository/url**: This is what the code references to find your accelerator *(Must be a .git url)*
5. `npm login`
6. `npm publish`
7. You are done!!

Try out installation of your new accelerator with `npx <package-name> TestProject`

**Optional steps:**
1. Add a custom brand message in `scripts/brandMessage.js` so your installs have a personal touch
2. Add specific next steps in `scripts/nextStepsMessage.js` if it's not generic
3. CHANGE THE WHOLE THING HOWEVER YOU LIKE! :D Go into `git-npx.js` and play around
