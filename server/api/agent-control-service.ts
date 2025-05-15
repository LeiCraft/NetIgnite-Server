import { AgentControlService } from "../agent-control-service";

export default defineWebSocketHandler(
    AgentControlService.getSocketHandler() as any
)