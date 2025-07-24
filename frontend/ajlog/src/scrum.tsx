import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

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
                        <li key={team.id}>
                            <Link to={`/scrum_team/${team.id}`}>{team.name}</Link>
                            <DeleteScrumTeam teamId={team.id} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
            <CreateScrumTeam />
        </div>
    );
}

export function CreateScrumTeam() {
    const [name, setName] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetch('http://localhost:8080/scrum_teams/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Team created:", data);
                setName('');
            })
            .catch(error => console.error("Creating team failed", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team Name"
                required
            />
            <button type="submit">Create Team</button>
        </form>
    );
}

export function DeleteScrumTeam({ teamId }: { teamId: number }) {
    const handleDelete = () => {
        fetch(`http://localhost:8080/scrum_teams/${teamId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log("Team deleted successfully");
                } else {
                    console.error("Failed to delete team");
                }
            })
            .catch(error => console.error("Deleting team failed", error));
    };

    return (
        <button onClick={handleDelete}>
            Delete Team
        </button>
    );
}
