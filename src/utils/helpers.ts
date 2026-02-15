export const generateId = (): string => {
    return Date.now().toString();
};

export const formatCurrentDate = (): string => {
    return new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
