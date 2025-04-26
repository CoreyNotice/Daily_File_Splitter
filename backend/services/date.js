export const today = () => {
    const now = new Date(); // Get the current date
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0'); // Format with leading zero
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
};