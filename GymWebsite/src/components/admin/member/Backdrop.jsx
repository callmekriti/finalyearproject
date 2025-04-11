import { motion } from "framer-motion";


const Backdrop = ({children, onClick}) => {

    return (
        <motion.div
        className="absolute top-0 left-0 overflow-auto w-[100%] h-[100vh] bg-black flex justify-center items-center bg-opacity-80 z-auto"
        onClick={onClick}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        >
            {children}
        </motion.div>
    )

}
export default Backdrop;