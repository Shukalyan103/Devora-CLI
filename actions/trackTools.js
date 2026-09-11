export function trackTool(
  toolName,
  tool,
  tracker
) {

  return {
    ...tool,

    execute: async (input) => {

      const actionId = tracker.start({
        toolName,
        input
      });

      try {

        const result =
          await tool.execute(input);

        tracker.complete(
          actionId,
          result
        );

        return result;

      } catch (error) {

        tracker.fail(
          actionId,
          error
        );

        throw error;
      }

    }
  };
}