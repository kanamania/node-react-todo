import { Container } from "@mui/material"
import TodoList from "../features/TodoList";

const HomePage = () => {
    return (
        <Container maxWidth="lg">
            <TodoList />
        </Container>
    )
}

export default HomePage
