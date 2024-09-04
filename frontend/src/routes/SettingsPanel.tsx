import React, { useState, useEffect } from 'react';

export default function SettingsPanel (){
    // retrieve the dark mode preference from localStorage or default to false
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('dark-mode');
        return savedMode === 'true';
    });

    // toggle dark mode and store the preference in localStorage
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode); // Save the preference
            return newMode;
        });
    };

    // apply or remove dark mode based on the state
    useEffect(() => {
        if (isDarkMode) {
            //document.body.classList.add('dark-mode');
            document.body.classList.add('dark');
        } else {
            //document.body.classList.remove('dark-mode');
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 p-8 rounded-md">
        <div className={isDarkMode ? 'dark-mode' : ''}>
            <div className="toggle-container">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <span className="slider round"></span>
                </label>
                <span className="toggle-label">Dark mode</span>
            </div>
        </div>
        </section>
    );
};