import { AnimatePresence, motion, useAnimation, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import "./index.css"
import bootstrap from "../../../img/bootstrap.svg"
import Cplusplus from "../../../img/C++.svg"
import docker from "../../../img/docker.svg"
import spring from "../../../img/spring.svg"
import react from "../../../img/react.svg"
import postgreSql from "../../../img/postSql.svg"
import mySql from "../../../img/mySql.svg"
import mongo from "../../../img/mongoDB.svg"
import java from "../../../img/java.svg"
import html from "../../../img/html.svg"
import git from "../../../img/git.svg"
import css from "../../../img/css.svg"
import js from "../../../img/javascript.svg"
import HoverCard from "./HoverCard"

const imagePath = [bootstrap, Cplusplus, docker, spring, react, postgreSql, mySql, mongo, js, java, html, git, css]
const imagePaths = [
  {
    src: bootstrap,
    name: "Bootstrap",
    description:
      "A popular CSS framework for responsive web design. It provides pre-built components and utilities for rapid UI development.",
    color: "#7952B3",
  },
  {
    src: Cplusplus,
    name: "C++",
    description:
      "A powerful, high-performance programming language used for system/software development, game programming, and more.",
    color: "#00599C",
  },
  {
    src: docker,
    name: "Docker",
    description:
      "A platform for developing, shipping, and running applications in containers, ensuring consistency across different environments.",
    color: "#2496ED",
  },
  {
    src: spring,
    name: "Spring",
    description:
      "An application framework for Java that provides infrastructure support for developing robust Java applications quickly and easily.",
    color: "#6DB33F",
  },
  {
    src: react,
    name: "React",
    description:
      "A JavaScript library for building user interfaces, particularly single-page applications where you need a fast, interactive user experience.",
    color: "#61DAFB",
  },
  {
    src: postgreSql,
    name: "PostgreSQL",
    description:
      "An advanced, open-source relational database known for its reliability, feature robustness, and performance.",
    color: "#336791",
  },
  {
    src: mySql,
    name: "MySQL",
    description:
      "An open-source relational database management system that is fast, reliable, and easy to use. It's popular for web applications.",
    color: "#4479A1",
  },
  {
    src: mongo,
    name: "MongoDB",
    description:
      "A document-oriented NoSQL database used for high volume data storage. It provides high performance, high availability, and easy scalability.",
    color: "#47A248",
  },
  {
    src: js,
    name: "JavaScript",
    description:
      "A high-level, interpreted programming language that is a core technology of the World Wide Web, alongside HTML and CSS.",
    color: "#F7DF1E",
  },
  {
    src: java,
    name: "Java",
    description:
      "A popular, object-oriented programming language used for developing a wide range of applications, from mobile apps to enterprise software.",
    color: "#007396",
  },
  {
    src: html,
    name: "HTML",
    description:
      "The standard markup language for creating web pages. It describes the structure of a web page semantically.",
    color: "#E34F26",
  },
  {
    src: git,
    name: "Git",
    description:
      "A distributed VCS for tracking changes in source code during software development, enabling collaboration among developers.",
    color: "#F05032",
  },
  {
    src: css,
    name: "CSS",
    description:
      "A style sheet language used for describing the look and formatting of a document written in HTML or XML.",
    color: "#1572B6",
  },
]
// const ImagesCircle = () => {
//   const [rotation, setRotation] = useState(0)
//   const [transitionProgress, setTransitionProgress] = useState(0)
//   const [isShrunk, setIsShrunk] = useState(false)
//   const [visibleImages, setVisibleImages] = useState(0)

//   const numImages = imagePaths.length
//   const angleStep = 360 / numImages
//   const gapSize = 20 // Gap size in pixels
//   const circleRadius = 200 // Circle radius

//   useEffect(() => {
//     // Start rotation immediately
//     const rotationInterval = setInterval(() => {
//       setRotation((prev) => (prev + 2) % 360)
//     }, 25)

//     // Gradually show images
//     const imageInterval = setInterval(() => {
//       setVisibleImages((prev) => {
//         if (prev < numImages) return prev + 1
//         clearInterval(imageInterval)
//         return prev
//       })
//     }, 100)

//     // Start transition to horizontal line after 2 seconds of rotation
//     const transitionTimer = setTimeout(() => {
//       setIsShrunk(true)
//       const transitionInterval = setInterval(() => {
//         setTransitionProgress((prev) => {
//           if (prev >= 1) {
//             clearInterval(transitionInterval)
//             clearInterval(rotationInterval)
//             return 1
//           }
//           return prev + 0.02
//         })
//       }, 20)

//       return () => clearInterval(transitionInterval)
//     }, 2000) // Start transition after 2 seconds

//     return () => {
//       clearInterval(rotationInterval)
//       clearInterval(imageInterval)
//       clearTimeout(transitionTimer)
//     }
//   }, [numImages])

//   return (
//     <div
//       className={`circle-container ${
//         isShrunk ? "h-[200px] ml-[3rem]" : "h-[400px]"
//       } transition-all duration-1000 ease-in-out flex justify-center items-center`}
//     >
//       {imagePaths.map((src, i) => {
//         const angle = angleStep * i + rotation
//         const circleX = `calc(${circleRadius}px * ${Math.cos((angle - 90) * (Math.PI / 180))})`
//         const circleY = `calc(${circleRadius}px * ${Math.sin((angle - 90) * (Math.PI / 180))})`
//         const lineX = `${i * (60 + gapSize) - (numImages * (60 + gapSize)) / 2}px`
//         const lineY = "0px"

//         const x = `calc((1 - ${transitionProgress}) * (${circleX}) + ${transitionProgress} * (${lineX}))`
//         const y = `calc((1 - ${transitionProgress}) * (${circleY}) + ${transitionProgress} * (${lineY}))`

//         return (
//           <motion.div
//             key={i}
//             className="absolute flex justify-center items-center"
//             initial={false}
//             animate={{
//               x: `calc(50% + ${x} - 30px)`,
//               y: `calc(50% + ${y} - 30px)`,
//             }}
//             transition={{
//               duration: 0.1,
//               ease: "linear",
//             }}
//           >
//             <img
//               src={src || "/placeholder.svg"}
//               alt={`Technology ${i + 1}`}
//               width={60}
//               height={60}
//               className={`imgs object-cover shadow-md transition-all duration-300 ease-in-out p-2`}
//               style={{
//                 opacity: i < visibleImages ? 1 : 0,
//               }}
//             />
//           </motion.div>
//         )
//       })}
//     </div>
//   )
// }

const ImagesCircle = () => {
  const [rotation, setRotation] = useState(0)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [isShrunk, setIsShrunk] = useState(false)
  const [visibleImages, setVisibleImages] = useState(0)
  const [hoveredImage, setHoveredImage] = useState(null)

  const numImages = imagePaths.length
  const angleStep = 360 / numImages
  const gapSize = 20 // Gap size in pixels
  const circleRadius = 200 // Circle radius

  useEffect(() => {
    // Start rotation immediately
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360)
    }, 25)

    // Gradually show images
    const imageInterval = setInterval(() => {
      setVisibleImages((prev) => {
        if (prev < numImages) return prev + 1
        clearInterval(imageInterval)
        return prev
      })
    }, 100)

    // Start transition to horizontal line after 2 seconds of rotation
    const transitionTimer = setTimeout(() => {
      setIsShrunk(true)
      const transitionInterval = setInterval(() => {
        setTransitionProgress((prev) => {
          if (prev >= 1) {
            clearInterval(transitionInterval)
            clearInterval(rotationInterval)
            return 1
          }
          return prev + 0.02
        })
      }, 20)

      return () => clearInterval(transitionInterval)
    }, 2000) // Start transition after 2 seconds

    return () => {
      clearInterval(rotationInterval)
      clearInterval(imageInterval)
      clearTimeout(transitionTimer)
    }
  }, [numImages])

  return (
    <div
      className={`circle-container ${
        isShrunk ? "h-[200px] ml-[3rem]" : "h-[400px]"
      } transition-all duration-1000 ease-in-out flex justify-center items-center relative`}
    >
      {imagePaths.map((img, i) => {
        const angle = angleStep * i + rotation
        const circleX = `calc(${circleRadius}px * ${Math.cos((angle - 90) * (Math.PI / 180))})`
        const circleY = `calc(${circleRadius}px * ${Math.sin((angle - 90) * (Math.PI / 180))})`
        const lineX = `${i * (60 + gapSize) - (numImages * (60 + gapSize)) / 2}px`
        const lineY = "0px"

        const x = `calc((1 - ${transitionProgress}) * (${circleX}) + ${transitionProgress} * (${lineX}))`
        const y = `calc((1 - ${transitionProgress}) * (${circleY}) + ${transitionProgress} * (${lineY}))`

        return (
          <motion.div
            key={i}
            className="absolute flex justify-center items-center"
            initial={false}
            animate={{
              x: `calc(50% + ${x} - 30px)`,
              y: `calc(50% + ${y} - 30px)`,
            }}
            transition={{
              duration: 0.1,
              ease: "linear",
            }}
            onMouseEnter={() => isShrunk && setHoveredImage(i)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <img
              src={img.src || "/placeholder.svg"}
              alt={img.name}
              width={60}
              height={60}
              className={`imgs object-cover shadow-md transition-all duration-300 ease-in-out p-2 rounded-full ${
                isShrunk ? "hover:scale-110" : ""
              }`}
              style={{
                opacity: i < visibleImages ? 1 : 0,
                backgroundColor: `${img.color}10`,
              }}
            />
            <AnimatePresence>
              {isShrunk && hoveredImage === i && (
                <HoverCard name={img.name} description={img.description} icon={img.src} color={img.color} />
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ImagesCircle