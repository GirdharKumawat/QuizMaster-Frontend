import {Lock} from 'lucide-react'
 
const GoogleLoginButton= ()=>{

    return(
        <button className="w-full mb-2 flex items-center justify-center border border-gray-300 rounded
        px-4 py-2 mt-4 hover:bg-gray-100 transition">
            <Lock className=" mr-2" size={20} />
            <span className="text-gray-700">Continue with Google</span>
        </button>
    )
}

export default GoogleLoginButton;