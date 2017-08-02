using System.Web.Http;

namespace vc_module_aviary_image_editor.Controllers.Api
{
    [RoutePrefix("api/vc_module_aviary_image_editor")]
public class ManagedModuleController : ApiController
{
    // GET: api/managedModule
    [HttpGet]
    [Route("")]
    public IHttpActionResult Get()
    {
        return Ok(new { result = "Hello world!" });
    }
}
}
