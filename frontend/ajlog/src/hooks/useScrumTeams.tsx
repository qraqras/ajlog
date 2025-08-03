import React, { useState } from "react";

export const useScrumTeams = () => {

    const [scrumTeams, setScrumTeams] = useState([]);

    const loadScrumTeams = () => {
        fetch('http://localhost:8080/scrum_teams/order/')
            .then(response => response.json())
            .then(data => setScrumTeams(data))
            .catch(error => console.error("load error", error));
    }

    const deleteScrumTeams = () => {
        fetch(`http://localhost:8080/scrum_teams/${teamId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    loadScrumTeams();
                }
            })
            .catch(error => console.error("delete error", error));
    }

    return [scrumTeams, loadScrumTeams, deleteScrumTeams]
};
