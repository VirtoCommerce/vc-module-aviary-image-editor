using Microsoft.Practices.Unity;
using VirtoCommerce.Platform.Core.Modularity;

namespace VirtoCommerce.AviaryImageEditorModule.Web
{
    public class Module : ModuleBase
    {
        private readonly IUnityContainer _container;

        public Module(IUnityContainer container)
        {
            _container = container;
        }

        public override void SetupDatabase()
        {
        }

        public override void Initialize()
        {
            base.Initialize();
        }

        public override void PostInitialize()
        {
            base.PostInitialize();
        }
    }
}
