using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ApiPiagetDois.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiPiagetDoisContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ApiPiagetDoisContext") ?? throw new InvalidOperationException("Connection string 'ApiPiagetDoisContext' not found.")));


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Policy Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


// Policy Cors
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
