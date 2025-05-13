export const CustomWordsSelector = ({customWords, setCustomWord}: {
    customWords: string[];
    setCustomWord: (indes: number, val: string) => void;
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Custom Words</label>
        {customWords.map((word, i) => (
            <input
            key={i}
            value={word}
            onChange={(e) => setCustomWord(i, e.target.value)}
            placeholder={`Custom word ${i + 1}`}
            className="w-full mb-2 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 to-blue-500"
            />
        ))}
    </div>
);