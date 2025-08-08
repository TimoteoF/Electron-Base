import { useState, useEffect } from 'react';
import { trpc } from './lib/trpcClient';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);
    const [osInfo, setOsInfo] = useState<{ platform: string; node: string } | null>(null);

    useEffect(() => {
        trpc.os.getInfo
            .query()
            .then((info) => setOsInfo(info))
            .catch(() => {});
    }, []);

    return (
        <>
            <div>
                <a href='https://vite.dev' target='_blank'>
                    <img src={viteLogo} className='logo' alt='Vite logo' />
                </a>
                <a href='https://react.dev' target='_blank'>
                    <img src={reactLogo} className='logo react' alt='React logo' />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className='card'>
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
                {osInfo && (
                    <p>
                        OS: {osInfo.platform}, Node: {osInfo.node}
                    </p>
                )}
            </div>
            <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
