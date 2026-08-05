import { useState } from "react";
import DifficultyButton from "./DifficultyButton";
import { difficulties } from "./difficulties";

function DifficultyPanel() {
    const [selected, setSelected] = useState("MEDIUM");

    return (
        <aside
            className="
                w-full
                h-full

                bg-[#F9F9F9]

                border-2
                border-[#DBDBDB]

                rounded-[10px]

                p-[10px]
            "
        >
            <div
                className="
                    flex
                    flex-col

                    pt-[20px]
                    gap-[10px]

                    h-full
                "
            >
                {difficulties.map((difficulty) => (
                    <div
                        key={difficulty.id}
                        className="w-[95%] mx-auto"
                    >
                        <DifficultyButton
                            difficulty={difficulty}
                            active={selected === difficulty.id}
                            onClick={() => setSelected(difficulty.id)}
                        />
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default DifficultyPanel;