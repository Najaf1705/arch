import { AiFillGithub } from "react-icons/ai"

const GithubLink = () => {
  return (
    <AiFillGithub size={36}
          className="cursor-pointer hover:text-c10 transition"
          onClick={() => window.open("https://github.com/Najaf1705/arch", "_blank")}
          aria-label="Visit GitHub repository"
          title="Visit GitHub repository"
        /> 
  )
}

export default GithubLink