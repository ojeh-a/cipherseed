type Props = {
    message: string;
    type: 'success' | 'error';
};

export const Alert = ({message, type}: Props) => (
    <div className={`p-3 mb-4 rounded-xl text-sm ${type == 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {message}
    </div>
);