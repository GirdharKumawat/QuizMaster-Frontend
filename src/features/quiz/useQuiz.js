import axiosAPI from "../../axios";
 import { useDispatch,useSelector } from "react-redux";
import {  setLoading, setError, setQuiz } from "./quizSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useQuiz = () => {
    const quizState = useSelector((state) => state.quiz);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getQuiz = async (quizId) => {
        try {
            dispatch(setLoading(true));
            const res = await axiosAPI.get(`quizzes/`);
            const data = res.data;
            console.log("Fetched quiz:", data);
            dispatch(setQuiz(data.quizzes));
         
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to fetch quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
         
        }
    };
    
    // const createQuiz = async (quizData) => {
    //     try {
    //         dispatch(setLoading(true));
    //         const res = await axiosAPI.post("quiz/create/", quizData);
    //         const data = res.data;
    //         dispatch(setDetails(data));
    //         toast.success("Quiz created successfully!");
    //         return data;
    //     } catch (err) {
    //         const errorMsg = err.response?.data?.message || err.message || "Failed to create quiz.";
    //         dispatch(setError(errorMsg));
    //         toast.error(errorMsg);
    //         return null;
    //     }
    //     finally {
    //         dispatch(setLoading(false));
    //     }
    // };


    return {
        quizState,
        getQuiz,
    };
}

export { useQuiz };

