import { ControlService } from "../agent-control-service";

export default defineWebSocketHandler(
    ControlService.getSocketHandler() as any
)