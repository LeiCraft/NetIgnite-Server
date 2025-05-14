import { ControlService } from "../control-service";

export default defineWebSocketHandler(
    ControlService.getSocketHandler() as any
)