import { Route, Routes } from "react-router-dom";
import SelectionScreen from "../components/2secondPage/SelectionScreen0 editing";
import InputDesign from "../components/1initPage/InputDesign";
import TranslationResult from "../components/3resultPage/TranslationResult0";
import Frame from "../components/common/frame";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Frame />}>
                <Route index element={<InputDesign />} />
                <Route path="/selectBox" element={<SelectionScreen />} />
                <Route path="/result" element={<TranslationResult />} />
            </Route>
        </Routes>


    );
}

export default AppRoutes;