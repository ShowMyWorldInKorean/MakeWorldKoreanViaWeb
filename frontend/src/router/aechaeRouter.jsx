import { Route, Routes } from "react-router-dom";
import SelectionScreen from "../components/2secondPage/SelectionScreen0";
import InputDesign from "../components/1initPage/InputDesign";
import TranslationResult from "../components/3resultPage/TranslationResult0";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InputDesign/>} />
            <Route path="/selectBox" element={<SelectionScreen />} />
            <Route path="/result" element={<TranslationResult />} />

        </Routes>


    );
}

export default AppRoutes;