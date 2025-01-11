<!-- <a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br /> -->
<div align="center">
  <a href="https://github.com/alperen_velioglu/git-contribution-calendar-angular">
    <img src="images/gcclogo.png" alt="Logo" width="150" height="150">
  </a>

<h3 align="center">Git Contribution Calendar</h3>

  <p align="center">
    A modern web application that visualizes your git contributions across multiple platforms (GitHub, Bitbucket) in a unified calendar view.
    <br />
    <br />
    <a href="https://github.com/alperen_velioglu/git-contribution-calendar-angular">View Demo</a>
    ·
    <a href="https://github.com/alperen_velioglu/git-contribution-calendar-angular/issues">Report Bug</a>
    ·
    <a href="https://github.com/alperen_velioglu/git-contribution-calendar-angular/issues">Request Feature</a>
  </p>
</div>

## About The Project

![Git Contribution Calendar Screen Shot](images/product-screenshot.png)

Git Contribution Calendar is a powerful tool that aggregates and visualizes your git contributions from multiple platforms. Whether you're using GitHub, Bitbucket, or both, this application provides a unified view of your coding activity throughout the year.

Key Features:
* Multi-provider support (GitHub and Bitbucket integration)
* Interactive contribution heatmap using D3.js
* Contribution statistics and insights
* Multi-language support (English & Turkish)
* Share capabilities

### Built With

* [![Angular][Angular.io]][Angular-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![TailwindCSS][TailwindCSS]][Tailwind-url]
* [![D3.js][D3.js]][D3-url]
* [![Material][Material]][Material-url]
* [![Apollo][Apollo]][Apollo-url]

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

* Node.js (v18 or higher)
* npm
  ```sh
  npm install npm@latest -g
  ```
* Angular CLI
  ```sh
  npm install -g @angular/cli
  ```

### Installation
   
1. Clone the repo
   ```sh
   git clone https://github.com/alperen_velioglu/git-contribution-calendar-angular.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Populate the src/proxy.conf.json file, because using localhost will block some Bitbucket endpoints due to CORS policy.
   ```json
   {
        "/rest/": {
        "target": "YOUR_BITBUCKET_URL",
        "secure": false,
        "changeOrigin": true
        },
        "/plugins/servlet/": {
        "target": "YOUR_BITBUCKET_URL",
        "secure": false,
        "changeOrigin": true
        }
    }
   ```

## Usage

1. Start the development server:
   ```sh
   ng serve
   ```
2. Open your browser and navigate to `http://localhost:4200`
3. Connect your GitHub and/or Bitbucket accounts
4. View your unified contribution calendar!


## Roadmap

- [x] GitHub Integration
- [x] Bitbucket Integration
- [x] Multi-language Support
- [ ] GitLab Integration
- [ ] Custom Date Range Selection
- [ ] Dark Theme

See the [open issues](https://github.com/alperen_velioglu/git-contribution-calendar-angular/issues) for a full list of proposed features and known issues.

## Contributing

Contributions are welcome! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

aeren53.ae@gmail.com

Project Link: [https://github.com/alperen_velioglu/git-contribution-calendar-angular](https://github.com/alperen_velioglu/git-contribution-calendar-angular)

## Acknowledgments

* [Angular Material](https://material.angular.io/)
* [D3.js](https://d3js.org/)
* [Apollo GraphQL](https://www.apollographql.com/)
* [Tailwind CSS](https://tailwindcss.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/alperen_velioglu/git-contribution-calendar-angular.svg?style=for-the-badge
[contributors-url]: https://github.com/alperen_velioglu/git-contribution-calendar-angular/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/alperen_velioglu/git-contribution-calendar-angular.svg?style=for-the-badge
[forks-url]: https://github.com/alperen_velioglu/git-contribution-calendar-angular/network/members
[stars-shield]: https://img.shields.io/github/stars/alperen_velioglu/git-contribution-calendar-angular.svg?style=for-the-badge
[stars-url]: https://github.com/alperen_velioglu/git-contribution-calendar-angular/stargazers
[issues-shield]: https://img.shields.io/github/issues/alperen_velioglu/git-contribution-calendar-angular.svg?style=for-the-badge
[issues-url]: https://github.com/alperen_velioglu/git-contribution-calendar-angular/issues
[license-shield]: https://img.shields.io/github/license/alperen_velioglu/git-contribution-calendar-angular.svg?style=for-the-badge
[license-url]: https://github.com/alperen_velioglu/git-contribution-calendar-angular/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your_linkedin_username
[product-screenshot]: public/assets/screenshot.png
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[D3.js]: https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white
[D3-url]: https://d3js.org/
[Material]: https://img.shields.io/badge/Material-757575?style=for-the-badge&logo=material-design&logoColor=white
[Material-url]: https://material.angular.io/
[Apollo]: https://img.shields.io/badge/Apollo%20GraphQL-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white
[Apollo-url]: https://www.apollographql.com/