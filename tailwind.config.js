module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        's': '4px 1px 17px rgba(253, 252, 252, 0.05)',
        'brown-s': '0 0 20px rgba(158, 009, 004, 1)',
        'yellow2': '0 0 20px rgba(235, 138, 006, 1)',
        'yellow1' : '0 0 20px rgb(209, 131, 40, 1)',
        'stepCard': '4px 8px 12px rgba(0, 0, 0, 0.12)'
      },
      colors: {
        'white': '#fff',
        'darkgray': '#1d1d1b',
        'yellow': '#f8de44',
        'yellow2': '#eb8a06',
        'brown': '#9e0904',
        'brown2': '#d15904',
        'yellow3': '#f6bc25',
        'pink': '#fd644f',
        'pink-2' : "#fb5988",
        'melon': '#f28e26',
        'hotpink': '#ff0f47',
        'lightpink': '#ffab96',
        'blue': '#3c65aa',
        'purple': '#c6379c',
        "yellow4": '#f5bc25',
        "orange": "#f9650b",
        "yellow5" : "#f6c930",
        "blue2" : "#2b96ea",
        "white2" : "#fdfcfd",
        "yellow4" : "#F79336",
        "yellowHover" : "#F8A85D",
        "yellowPressed" : "#C5752B",
        "yellowDisabled" : "#F79336",
        "outlineHover" : "#ECE7EE",
        "outlinePressed" : "#A4A2A4",
        "textOutlineHover" : "#A4A2A4",
        "textOutlinePressed" : " #FDFCFD",
        "grayColor" : "#F3F0F5",
        "dark-blue" : "#164E55",
        "Light/Light" : "#ECE7EE"
      },
      borderRadius: {
        'xlarge': '15px',
        '20': '20px',
      },
      backgroundImage: {
        'background-landing': "url('./assets/img/background_landing.png')",
        'hero-rocket': "url('./assets/img/Rocket.png')",
        'trendings-background': "url('./assets/img/Trending2.png')",
        'crear-background': "url('./assets/img/Back_Crear.png')",
        'steps-background': "url('./assets/img/landing/thirdSection/Gradient.png')",
        "Hero_2": "url('./assets/img/landing/firstSection/Hero_2.png')",
        "Hero_mobile_2": "url('./assets/img/landing/firstSection/Hero_mobile_2.png')",
        "Crea_y_vende_tus_NFTs_2": "url('./assets/img/landing/thirdSection/Crea_y_vende_tus_NFTs_2.png')",
        "ntvTokenBlured": "url('./assets/img/landing/sponsorsSection/bluredntvToken.png')"
      },
      backgroundSize: {
        '40': '40%'
      },
      fontFamily: {
        'raleway': ['raleway', 'sans-serif'], 
        'open-sans': ['Open Sans', 'sans-serif'],
        'clash-grotesk': ["Clash Grotesk", "sans-serif"]
      }
    }
  },
  plugins: [],
}
