Solar System Simulation
Welcome to the Solar System Simulation project! This interactive 3D visualization showcases the planets of our solar system, complete with orbital paths, customizable controls, and an engaging user interface. Built using Three.js, this project is designed for educational purposes and as a demonstration of web-based 3D graphics.
Project Overview
This project creates a dynamic 3D model of the solar system, featuring:

Planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn (with rings), Uranus, and Neptune, each with unique textures and sizes.
Sun: A central light source casting shadows.
Orbit Paths: Dashed lines representing planetary orbits.
Interactivity: Click-to-focus functionality, orbit controls, and a tooltip system.
Controls: Adjustable speed and inclination sliders for each planet, plus Pause/Resume and Theme Toggle buttons.
Info Panel: Displays planet details (distance, size, and specialties) upon clicking.

The simulation is hosted live for easy access—see the Live Link section below.
Features

3D Visualization: Planets rotate around the Sun with realistic scaling and textures.
Customizable Orbits: Adjust each planet's speed and inclination using sliders.
User Interface:
Pause/Resume Button: Toggles the animation.
Theme Toggle Button: Switches between dark and light modes.
Info Panel: Shows planet name, description, distance (in AU), size (in units), and specialty when clicked.


Bonus Features:
Twinkling starfield background.
Smooth camera transitions when focusing on planets or the Sun.
Responsive design for various screen sizes.


Specialties: Each planet highlights a unique trait (e.g., "Largest planet" for Jupiter, "Known for its rings" for Saturn).

Live Link
This project is deployed and accessible live at:https://3-d-solar-system-simulation-swart.vercel.app/
Prerequisites
To run this project locally, ensure you have the following installed:

Node.js: Version 14.x or higher (for serving the site or installing dependencies if needed).
A Web Browser: Chrome, Firefox, or Edge (recommended for WebGL support).
Text Editor: VS Code or any preferred editor.
Local Server: Optional but recommended (e.g., Live Server extension for VS Code).

Installation

Clone the Repository:

Download or clone this project to your local machine:git clone https://github.com/supriyakanumarla/3D-solar-system-simulation.git

(Use the URL above, which reflects your GitHub repository.)


Navigate to the Project Directory:

Open a terminal and cd into the project folder:cd 3D-solar-system-simulation




Verify File Structure:

Ensure the following files and folders are present:
index.html: The main HTML file.
style.css: Styles for the UI.
script.js: JavaScript logic using Three.js.
js/: Folder containing three.module.js and OrbitControls.js.
textures/: Folder containing planet and starfield images (e.g., sun.jpg, mercury.jpg, etc.).


Note: The js/ and textures/ files must be downloaded separately if not included in the repo:
three.module.js: From https://raw.githubusercontent.com/mrdoob/three.js/r148/build/three.module.js.
OrbitControls.js: From https://raw.githubusercontent.com/mrdoob/three.js/r148/examples/jsm/controls/OrbitControls.js.
Textures: Download sample images or use your own (ensure filenames match textures/[planet].jpg).





Running the Project Locally

Serve the Site:

Use a local server to avoid CORS issues with file loading:
Install the Live Server extension in VS Code, right-click index.html, and select "Open with Live Server".
Alternatively, use Node.js:npx serve

Then open http://localhost:3000 in your browser.




Manual Testing:

Open index.html directly in a browser (not recommended due to potential security restrictions, but works for basic testing).


Explore Features:

Click planets to focus and view details in the info panel.
Use mouse drag to rotate the view, scroll to zoom.
Adjust sliders to modify planet orbits.
Toggle Pause/Resume and switch themes using the buttons.



Deployment
This project is deployed using Vercel:

Install Vercel CLI:
Run npm install -g vercel in your terminal.


Deploy:
Navigate to your project folder: cd 3D-solar-system-simulation.
Run vercel and follow the prompts to log in and deploy.
Note the live URL provided (e.g., https://3-d-solar-system-simulation-swart.vercel.app/).


Alternative (Netlify):
Push to GitHub, log into netlify.com, connect your repo, and deploy with the publish directory set to ..


Usage Instructions

Interacting with Planets:
Click a planet to focus the camera and view its details (e.g., "Jupiter - Largest planet (Distance: 22 AU, Size: 2 units)").
Click the Sun to return to the overview.


Controls:
Sliders: Adjust "Speed" and "Inclination" for each planet’s orbit.
Pause/Resume: Toggle animation on/off (top-right button).
Theme Toggle: Switch between dark and light modes (below Pause).


Mouse Controls:
Drag to rotate the view.
Scroll to zoom in/out.
Hover over planets for a tooltip with the name.



Development Notes

Technologies:
Three.js: For 3D rendering and WebGL.
HTML/CSS: For structure and styling.
JavaScript: For logic and interactivity.


Challenges:
Ensuring texture loading and shadow rendering.
Dynamically positioning UI elements to avoid overlap.


Improvements:
Add real-scale distances and sizes (currently arbitrary units).
Include more planetary data (e.g., moons, temperature).
Optimize performance for larger starfields.



Contributing
Feel free to fork this repository, make improvements, and submit pull requests. Suggestions for enhancements are welcome!
Acknowledgments

Three.js community for the library and examples.
Texture assets sourced from public domain or created for this project.


Last Updated: July 23, 2025
