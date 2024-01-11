import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TabsComponent({
    tabs,
    defaultTab,
}: {
    tabs: any[],
    defaultTab: string,
}) {
  return (
    <Tabs defaultValue={defaultTab} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
            </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
          </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabsComponent