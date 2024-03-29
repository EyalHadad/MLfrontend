# Micro - Message RNA interactions, Frontend side

## Table of Contents
<ul>
<li> Installation</li>
<li> Scripts </li>
<li> Project Structure </li>
<li> Deployment and availability </li>
</ul>

## Installation

Prerequisite:
<ul>
<li>Git</li>
<li>Node.js package manager (NPM)</li>
</ul>

Once you clone the project, run the npm install command to install the npm packages the project uses.

You will have to add a local .env file with the project dependencies.

### `git clone`

### `npm start`

## Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Project Structure

<ul>
<li>.github - contains CICD files used by github actions</li>
<li>public - contains files generated by the [`npm build`] command</li>
<li>
    src - containse the source code of the project
    <ul>
    <li>api - contains api requests and objects</li>
    <li>classes - contains reused classes throughout the code</li>
    <li>components - all the componets that are reused throughtout the code</li>
    <li>extensions - images, gifs, videos etc.</li>
    <li>pages - the main pages in the web site, navigated through navbar</li>    
    </ul>
</li>
<li>package.json</li>
<li>package-lock.json</li>
<li>README.md</li>
<li>.gitignore</li>
<li>Dockerfile</li>
</ul>

## Deployment and Availability

The deployment of this project is continuous and made throught the github actions CICD native provider. <br>
The configuration is located in the .github directory, and configured to deploy on push, to the deploy branch. <br>
The pipeline will test, build and verify the app berfore the deployment is made. 

The website is up and running, and available at http://132.73.84.177/
