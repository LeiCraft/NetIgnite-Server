import type { UserAuthInfo } from '@/server/utils/auth/handler';
import { AgentControlService } from '~/server/agent-control-service';
import { DBStorage } from '~/server/db';
import type { ModelUtils } from '~/utils/models/utils';

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const idList = getQuery(event).ids?.toString().split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    const result: {
        [id: string]: ModelUtils.OnlineStatus.Type
    } = {};

    const ownedAgents = await DBStorage.Agents.getAllByOwnerID(userinfo.userID);
    if (!ownedAgents) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to retrieve agents statuses.", data: null };
    }

    for (const agent of ownedAgents) {

        if (idList && !idList.includes(agent.id)) {
            continue;
        }
        const agentStatus = AgentControlService.agents.get(agent.id);

        if (!agentStatus) {
            result[agent.id.toString()] = "unknown";
            continue;
        }
        
        result[agent.id.toString()] = agentStatus.isOnline() ? "online" : "offline";
    }
    
    return { status: "OK", data: result};
});