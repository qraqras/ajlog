import React, { useState, useEffect } from 'react';

type ScrumTeam = { id: number; name: string };

export function Scrum() {
    const [scrum, setScrum] = useState<ScrumTeam[] | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/scrum_teams/')
            .then(response => response.json())
            .then(data => setScrum(data))
            .catch(error => console.error("Fetching data failed", error));
    }, []);
    return (
        <div>
            <h1>Scrum Teams</h1>
            {scrum ? (
                <ul>
                    {scrum.map(team => (
                        <li key={team.id}>{team.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
