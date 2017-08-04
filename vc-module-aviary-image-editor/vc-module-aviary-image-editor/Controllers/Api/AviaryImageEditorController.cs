using System.Web.Http;

namespace VirtoCommerce.AviaryImageEditor.Web.Controllers.Api
{
    [RoutePrefix("api/virtoCommerce.imageEditor")]
public class ManagedModuleController : ApiController
{
    // GET: api/managedModule
    [HttpGet]
    [Route("")]
    public IHttpActionResult Get()
    {
        return Ok(new { result = "Loading success" });
    }
}
}
