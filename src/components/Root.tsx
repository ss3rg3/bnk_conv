import { useState } from 'react';
import { Container } from 'rsuite';
import { NormalizedRow } from '../models/NormalizedRow.tsx';
import MainContent from "./maincontent/MainContent.tsx";
import ActionSidebar from "./actionsidebar/ActionSidebar.tsx";

export default function Root() {
    const [normalizedRows, setNormalizedRows] = useState<NormalizedRow[]>([]);

    return (
        <Container style={{ height: '100vh' }}>
            <ActionSidebar normalizedRows={normalizedRows} setNormalizedRows={setNormalizedRows} />
            <MainContent normalizedRows={normalizedRows} />
        </Container>
    );
}
