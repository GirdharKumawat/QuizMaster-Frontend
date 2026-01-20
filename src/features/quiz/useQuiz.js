import { useDispatch, useSelector } from "react-redux";
import { 
    setLoading, 
    setError, 
    setCreatedQuizzes, 
    addCreatedQuiz, 
    setEnrolledQuizzes,  
    addEnrolledQuiz, 
    setCanTry 
} from "./quizSlice";
import { toast } from "../../components/UI/ui";
import { quizApi } from "../../api/quizApi"; // Import API Layer

export const useQuiz = () => {
    const quizState = useSelector((state) => state.quiz);
    const dispatch = useDispatch();


    //  functions to get, create, join quizzes
    const getAllQuizzes = async () => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.listQuizzes();
            const hosted_quizzes = res.data.hosted_quizzes;
            const enrolled_quizzes = res.data.enrolled_quizzes;
            dispatch(setCreatedQuizzes(hosted_quizzes || []));
            dispatch(setEnrolledQuizzes(enrolled_quizzes || []));
            dispatch(setCanTry(false));   
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to fetch quizzes.";
            dispatch(setError(errorMsg));
            toast.error({ title: "Error", detail: errorMsg });
        } finally {
            dispatch(setLoading(false));
        }

    };
    // 3. Create a New Quiz
    const createQuiz = async (quizData) => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.create(quizData);
            const newQuiz = res.data;
            
            // Optimization: Update Redux immediately without re-fetching
            if (newQuiz) {
                dispatch(addCreatedQuiz(newQuiz));
            }
            
            toast.success({ title: "Success", detail: "Quiz created successfully!" });
            return newQuiz;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to create quiz.";
            dispatch(setError(errorMsg));
            toast.error({ title: "Error", detail: errorMsg });
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };
 
    const joinQuiz = async (sessionId) => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.join(sessionId);
            const joinedQuiz = res.data;
            if (joinedQuiz) {
                dispatch(addEnrolledQuiz(joinedQuiz));
            }
            toast.success({ title: "Success", detail: "Joined quiz successfully!" });
            return joinedQuiz;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to join quiz.";
            dispatch(setError(errorMsg));
            toast.error({ 
                title: "Failed to Join", 
                detail: err.response?.data?.detail || errorMsg 
            });
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };


    return {
        quizState,  
        getAllQuizzes,
        createQuiz,
        joinQuiz,
        
    };
};