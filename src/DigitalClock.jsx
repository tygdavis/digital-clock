import {useState, useEffect} from 'react';

function DigitalClock({ is24h = false }) {
    
    const [time, setTime] = useState(new Date());

    // on mount
    useEffect(()=>{
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    function padZero(number) {
        return (number < 10 ? "0" : "") + number;
    }

    function formatTime() {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const meridiem = hours >= 12 ? "pm" : "am";
        if (is24h) {
            // military time
            return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

        } else {
            hours = hours % 12 || 12; // non military
            
            return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
        }

    }

    

    return(
        <div className="clock-container">
            <div className="clock">
                <span>{formatTime()}</span>
            </div>
        </div>
    );
}

export default DigitalClock;