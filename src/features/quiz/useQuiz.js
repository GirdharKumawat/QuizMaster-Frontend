import axiosAPI from "../../axios";
 import { useDispatch,useSelector } from "react-redux";
import {  setLoading, setError, setCretedQuizzes ,setCanTry,setEnrolledQuizzes} from "./quizSlice";
import { toast } from "sonner";

const useQuiz = () => {
    const quizState = useSelector((state) => state.quiz);
    const dispatch = useDispatch();
    //  
    //  

    const getCretedQuizzes = async (quizId) => {
        try {
            dispatch(setLoading(true));
            const res = await axiosAPI.get(`quizzes/created/`);
            const data = res.data;
             
            dispatch(setCretedQuizzes(data.quizzes));
            dispatch(setCanTry(false));   
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to fetch quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getEnrolledQuizzes = async (quizId) => {
        try {
            dispatch(setLoading(true));
            const res = await axiosAPI.get(`quizzes/enrolled/`);
            const data = res.data; 
            dispatch(setEnrolledQuizzes(data.quizzes));
            dispatch(setCanTry(false));   
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to fetch quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createQuiz = async (quizData) => {
        try {
            dispatch(setLoading(true));
            const res = await axiosAPI.post("quizzes/create/", quizData);
            const data = res.data;
            // store returned quiz data in state (adjust as needed)
            dispatch(setCretedQuizzes(data || []));
            toast.success("Quiz created successfully!");
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to create quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const joinQuiz = async (quizId) => {
        try {
            dispatch(setLoading(true));
            const res = await axiosAPI.post(`quizzes/${quizId}/join/`);
            const data = res.data;
            // store returned quiz data in state (adjust as needed)
            console.log("Joined quiz data:", data);
            toast.success("Joined quiz successfully!");
            return data;
        }
        catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to join quiz.";
            dispatch(setError(errorMsg));
            toast.error(err.response.data.detail);
            return null;
        }
        
    }

    const startQuiz = async (quizId) => {
        console.log("Starting quiz with ID:", quizId);
        try {
            dispatch(setLoading(true));
            const  res  = await axiosAPI.post(`quizzes/${quizId}/start/`);
            const data = res.data;
            toast.success("Quiz started successfully!");
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to start quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getCurrentQuestion = async (quiz_id) => {
        try {
            const res = await axiosAPI.get(`quizzes/${quiz_id}/question/`);
            const data = res.data;
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to fetch current question.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        }  

    }

    const submitAnswer = async (quiz_id, answerData) => {
        try {
            const res = await axiosAPI.post(`quizzes/${quiz_id}/submit/`, answerData);
            const data = res.data;
            return data;
        }
        catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to submit answer.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        }
    };



    return {
        quizState,
        getCretedQuizzes,
        getEnrolledQuizzes,
        createQuiz,
        joinQuiz,
        startQuiz,
        getCurrentQuestion,
        submitAnswer
    };
}

export { useQuiz };

